import { NextResponse } from 'next/server';
import reviewsData from '@/data/reviews.json';

export async function GET() {
  try {
    const reviews = reviewsData as Array<{
      name: string;
      profileUrl: string;
      rating: number;
      text: string;
      timestamp: string;
    }>;

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    return NextResponse.json({
      averageRating,
      totalReviews,
      reviews,
    });
  } catch (error) {
    console.error('Error loading reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
