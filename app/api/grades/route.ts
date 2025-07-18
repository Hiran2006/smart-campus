import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { submissionId, score, feedback } = await req.json();

    // Check if the user is a teacher
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
    });

    if (!teacher) {
      return new NextResponse('Only teachers can grade submissions', { status: 403 });
    }

    // Check if the submission exists and get the assignment
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      return new NextResponse('Submission not found', { status: 404 });
    }

    // Check if the teacher is the one who created the assignment
    if (submission.assignment.teacherId !== teacher.id) {
      return new NextResponse('You can only grade submissions for your own assignments', { status: 403 });
    }

    // Create or update the grade
    const grade = await prisma.grade.upsert({
      where: { submissionId },
      update: {
        score,
        feedback,
        gradedAt: new Date(),
      },
      create: {
        submissionId,
        score,
        feedback,
        gradedAt: new Date(),
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.error('Error creating/updating grade:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get('submissionId');

    if (!submissionId) {
      return new NextResponse('Submission ID is required', { status: 400 });
    }

    const grade = await prisma.grade.findUnique({
      where: { submissionId },
    });

    if (!grade) {
      return new NextResponse('Grade not found', { status: 404 });
    }

    return NextResponse.json(grade);
  } catch (error) {
    console.error('Error fetching grade:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
