import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Create a test project
    const newProject = await prisma.project.create({
      data: {
        userId: 'test-user-id', // Replace with a valid Firebase User ID in a real scenario
        name: 'Test Project',
        description: 'This is a test project created via API.',
        cost: 100.0,
        margin: 0.2,
        price: 125.0, // Calculated (cost / (1 - margin)) ; 100 / (1 - 0.2) = 100 / 0.8 = 125
      },
    });

    // Retrieve the created project (optional, but good for testing)
    // In a real app, you might not need to retrieve it immediately after creation
    // unless you want to send the full object back in the response.
    const retrievedProject = await prisma.project.findUnique({
      where: {
        id: newProject.id,
      },
    });

    return NextResponse.json({ success: true, project: retrievedProject });
  } catch (error) {
    console.error('Error testing database connection:', error);
    // Ensure error is an instance of Error before accessing message property
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, message: 'Error testing database connection', error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
