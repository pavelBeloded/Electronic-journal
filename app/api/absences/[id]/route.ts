import { NextResponse } from "next/server";
import { absences } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const { isExcused, note } = body;

    if (typeof isExcused !== "boolean" && note === undefined) {
      return NextResponse.json(
        {
          ok: false,
          error: "Provide at least one field to update: isExcused or note",
        },
        { status: 400 },
      );
    }

    const existingAbsence = await db
      .select({ id: absences.id })
      .from(absences)
      .where(eq(absences.id, id))
      .limit(1);

    if (existingAbsence.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Absence not found",
        },
        { status: 404 },
      );
    }

    const updateAbsence: {
      isExcused?: boolean;
      note?: string | null;
    } = {};

    if (typeof isExcused === "boolean") {
      updateAbsence.isExcused = isExcused;
    }

    if (note !== undefined) {
      updateAbsence.note = note;
    }

    const updatedAbsence = await db
      .update(absences)
      .set(updateAbsence)
      .where(eq(absences.id, id))
      .returning();

    return NextResponse.json({
      ok: true,
      data: updatedAbsence[0],
      message: "Absence updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to update absence",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const existingAbsence = await db
      .select({ id: absences.id })
      .from(absences)
      .where(eq(absences.id, id))
      .limit(1);

    if (existingAbsence.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Absence not found",
        },
        { status: 404 },
      );
    }

    await db.delete(absences).where(eq(absences.id, id));

    return NextResponse.json({
      ok: true,
      message: "Absence deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, error: "Failed to delete absence" },
      { status: 500 },
    );
  }
}
