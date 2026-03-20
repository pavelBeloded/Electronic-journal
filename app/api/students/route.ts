import {db} from "@/db";
import { students, groups, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const result = await db.select({
            studentId: students.id,
            fullName: students.fullName,
            subgroup: students.subgroup,
            groupName: groups.name,
            email: users.email,
            role: users.role,
        })
            .from(students)
            .innerJoin(groups, eq(students.groupId, groups.id))
            .innerJoin(users, eq(students.userId, users.id));

        return NextResponse.json({ok: true, data: result});
    } catch (error) {
        console.error(error);

        return NextResponse.json({ok: false, error: "Failed to fetch users"}, {status: 500});
    }
}