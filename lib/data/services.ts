import { asc, eq, inArray, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { requirePermission } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  auditLogs,
  media,
  serviceRequirements,
  services,
  serviceSteps,
} from "@/lib/db/schema";
import { deleteMediaIfUnused } from "@/lib/data/media";
import type { ServiceInput } from "@/lib/validation/service";
import { formatFileSize, storePdf } from "@/lib/uploads/storage";

export type ServiceIconName = "register" | "transfer" | "cancel";

export type ServiceFormFile = {
  id: string;
  filename: string;
  bytes: number;
  size: string;
  href: string;
};

export type PublicService = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: ServiceIconName;
  duration: string;
  cost: string;
  note: string;
  updatedAt: string;
  requirements: string[];
  steps: { title: string; detail: string }[];
  form: ServiceFormFile | null;
};

export type AdminService = PublicService & {
  isPublished: boolean;
  requirementsDetailed: { id: string; text: string }[];
  stepsDetailed: { id: string; title: string; detail: string }[];
};

type GraphRow = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: ServiceIconName;
  duration: string;
  cost: string;
  note: string;
  isPublished: boolean;
  updatedAt: Date;
  formId: string | null;
  formFilename: string | null;
  formBytes: number | null;
};

const columns = {
  id: services.id,
  slug: services.slug,
  name: services.name,
  shortName: services.shortName,
  description: services.description,
  icon: services.icon,
  duration: services.duration,
  cost: services.cost,
  note: services.note,
  isPublished: services.isPublished,
  updatedAt: services.updatedAt,
  formId: media.id,
  formFilename: media.filename,
  formBytes: media.bytes,
};

function formOf(row: GraphRow): ServiceFormFile | null {
  if (!row.formId || !row.formFilename || row.formBytes === null) return null;

  return {
    id: row.formId,
    filename: row.formFilename,
    bytes: row.formBytes,
    size: formatFileSize(row.formBytes),
    href: `/api/files/${row.formId}`,
  };
}

async function fetchServicesGraph(onlyPublished: boolean) {
  const rows = (await db
    .select(columns)
    .from(services)
    .leftJoin(media, eq(services.formMediaId, media.id))
    .where(onlyPublished ? eq(services.isPublished, true) : undefined)
    .orderBy(asc(services.createdAt))) as GraphRow[];

  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const [requirements, steps] = await Promise.all([
    db
      .select({
        id: serviceRequirements.id,
        serviceId: serviceRequirements.serviceId,
        position: serviceRequirements.position,
        text: serviceRequirements.text,
      })
      .from(serviceRequirements)
      .where(inArray(serviceRequirements.serviceId, ids))
      .orderBy(asc(serviceRequirements.position)),
    db
      .select({
        id: serviceSteps.id,
        serviceId: serviceSteps.serviceId,
        position: serviceSteps.position,
        title: serviceSteps.title,
        detail: serviceSteps.detail,
      })
      .from(serviceSteps)
      .where(inArray(serviceSteps.serviceId, ids))
      .orderBy(asc(serviceSteps.position)),
  ]);

  return rows.map((row) => ({
    ...row,
    requirements: requirements.filter((item) => item.serviceId === row.id),
    steps: steps.filter((item) => item.serviceId === row.id),
  }));
}

export async function getPublicServices(): Promise<PublicService[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("services");

  const rows = await fetchServicesGraph(true);

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    description: row.description,
    icon: row.icon as ServiceIconName,
    duration: row.duration,
    cost: row.cost,
    note: row.note,
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
    requirements: row.requirements.map((item) => item.text),
    steps: row.steps.map((item) => ({
      title: item.title,
      detail: item.detail,
    })),
    form: formOf(row),
  }));
}

export async function getPublicService(
  slug: string,
): Promise<PublicService | undefined> {
  const all = await getPublicServices();
  return all.find((service) => service.slug === slug);
}

function toAdminService(
  row: Awaited<ReturnType<typeof fetchServicesGraph>>[number],
): AdminService {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    description: row.description,
    icon: row.icon as ServiceIconName,
    duration: row.duration,
    cost: row.cost,
    note: row.note,
    isPublished: row.isPublished,
    updatedAt: row.updatedAt.toISOString().slice(0, 10),
    requirements: row.requirements.map((item) => item.text),
    steps: row.steps.map((item) => ({
      title: item.title,
      detail: item.detail,
    })),
    requirementsDetailed: row.requirements.map((item) => ({
      id: item.id,
      text: item.text,
    })),
    stepsDetailed: row.steps.map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.detail,
    })),
    form: formOf(row),
  };
}

export async function listAdminServices(): Promise<AdminService[]> {
  await requirePermission("services:read");
  const rows = await fetchServicesGraph(false);
  return rows.map(toAdminService);
}

export async function getAdminService(
  id: string,
): Promise<AdminService | undefined> {
  await requirePermission("services:read");
  const rows = await fetchServicesGraph(false);
  return rows.map(toAdminService).find((service) => service.id === id);
}

function valuesFromInput(input: ServiceInput, actor: SessionUser) {
  return {
    slug: input.slug,
    name: input.name,
    shortName: input.shortName,
    description: input.description,
    icon: input.icon,
    duration: input.duration,
    cost: input.cost,
    note: input.note,
    isPublished: input.isPublished,
    updatedBy: actor.id,
    updatedAt: new Date(),
  };
}

async function writeRequirementsAndSteps(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  serviceId: string,
  input: ServiceInput,
) {
  await tx
    .delete(serviceRequirements)
    .where(eq(serviceRequirements.serviceId, serviceId));
  await tx.delete(serviceSteps).where(eq(serviceSteps.serviceId, serviceId));

  await tx.insert(serviceRequirements).values(
    input.requirements.map((text, index) => ({
      serviceId,
      position: index + 1,
      text,
    })),
  );

  await tx.insert(serviceSteps).values(
    input.steps.map((step, index) => ({
      serviceId,
      position: index + 1,
      title: step.title,
      detail: step.detail,
    })),
  );
}

export async function createService(
  input: ServiceInput,
  actor: SessionUser,
): Promise<string> {
  await requirePermission("services:write");

  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(services)
      .values(valuesFromInput(input, actor))
      .returning({ id: services.id });

    await writeRequirementsAndSteps(tx, row.id, input);

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "service.create",
      entity: "service",
      entityId: row.id,
      summary: `Menambahkan layanan ${input.name}.`,
    });

    return row.id;
  });
}

export async function updateService(
  id: string,
  input: ServiceInput,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("services:write");

  await db.transaction(async (tx) => {
    const updated = await tx
      .update(services)
      .set(valuesFromInput(input, actor))
      .where(eq(services.id, id))
      .returning({ id: services.id });

    if (updated.length === 0) {
      throw new Error("Layanan tidak ditemukan.");
    }

    await writeRequirementsAndSteps(tx, id, input);

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "service.update",
      entity: "service",
      entityId: id,
      summary: `Memperbarui layanan ${input.name}.`,
    });
  });
}

export async function deleteService(
  id: string,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("services:delete");

  const formMediaId = await db.transaction(async (tx) => {
    const [row] = await tx
      .select({ name: services.name, formMediaId: services.formMediaId })
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!row) throw new Error("Layanan tidak ditemukan.");

    await tx.delete(services).where(eq(services.id, id));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "service.delete",
      entity: "service",
      entityId: id,
      summary: `Menghapus layanan ${row.name}.`,
    });

    return row.formMediaId;
  });

  if (formMediaId) await deleteMediaIfUnused(formMediaId);
}

export async function replaceFormPdf(
  serviceId: string,
  file: File,
  actor: SessionUser,
): Promise<void> {
  await requirePermission("services:write");

  const [service] = await db
    .select({
      name: services.name,
      formMediaId: services.formMediaId,
    })
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);

  if (!service) throw new Error("Layanan tidak ditemukan.");

  const stored = await storePdf(file);

  const { oldMediaId, newMediaId } = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(media)
      .values({
        kind: "pdf",
        filename: stored.filename,
        mime: stored.mime,
        bytes: stored.bytes,
        sha256: stored.sha256,
        path: stored.path,
        uploadedBy: actor.id,
      })
      .returning({ id: media.id });

    await tx
      .update(services)
      .set({
        formMediaId: inserted.id,
        updatedBy: actor.id,
        updatedAt: new Date(),
      })
      .where(eq(services.id, serviceId));

    await tx.insert(auditLogs).values({
      actorId: actor.id,
      action: "service.form.replace",
      entity: "service",
      entityId: serviceId,
      summary: `Mengganti formulir PDF ${service.name} menjadi ${stored.filename}.`,
    });

    return { oldMediaId: service.formMediaId, newMediaId: inserted.id };
  });

  if (oldMediaId && oldMediaId !== newMediaId) {
    await deleteMediaIfUnused(oldMediaId);
  }
}

export async function getServiceStats() {
  await requirePermission("services:read");

  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${services.isPublished})::int`,
    })
    .from(services);

  return row ?? { total: 0, published: 0 };
}

export async function getPdfCount(): Promise<number> {
  await requirePermission("services:read");

  const [row] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(media)
    .where(eq(media.kind, "pdf"));

  return row?.total ?? 0;
}
