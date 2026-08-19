import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../../lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string; commentId: string }> },
) {
    try {
        const { commentId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const role = (session.user as any).role;

        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        if (comment.userId !== userId && role !== "ADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.comment.delete({ where: { id: commentId } });
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
        console.error("Delete comment error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}