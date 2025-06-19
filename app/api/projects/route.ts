import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, cost, margin, userId: clientUserId } = body; // Assume userId might come from client for now

    // TODO: Replace clientUserId with actual authenticated user ID from Firebase Admin SDK in a real setup
    const userId = clientUserId || "mock-firebase-user-id"; // Placeholder

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ message: 'Name is required.' }, { status: 400 });
    }
    if (cost === undefined || typeof cost !== 'number' || cost < 0) {
      return NextResponse.json({ message: 'Cost must be a positive number.' }, { status: 400 });
    }
    if (margin === undefined || typeof margin !== 'number' || margin < 0 || margin > 100) {
      return NextResponse.json({ message: 'Margin must be between 0 and 100.' }, { status: 400 });
    }
    if (!userId) {
        return NextResponse.json({ message: 'User association failed.' }, { status: 400 });
    }

    // Price calculation
    // Ensure margin is treated as a percentage, e.g., 20% margin means price = cost / (1 - 0.20)
    const calculatedPrice = cost / (1 - margin / 100);

    const newProject = await prisma.project.create({
      data: {
        userId, // This should be the authenticated user's ID from Firebase
        name,
        description,
        cost,
        margin,
        price: calculatedPrice,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    let errorMessage = 'Failed to create project.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage, details: error instanceof Error ? error.stack : null }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
