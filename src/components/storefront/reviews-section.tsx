import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { getLocale, getTranslations } from "next-intl/server";

import { StarRating } from "@/components/shared/star-rating";

type Review = {
  id: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  createdAt: Date;
};

export async function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const t = await getTranslations("Product");
  const locale = await getLocale();
  const dateLocale = locale === "ar" ? ar : enUS;

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <StarRating rating={average} size={20} />
        <p className="text-sm text-muted-foreground">
          {t("outOfFive", { rating: average.toFixed(1), count: reviews.length })}
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noReviews")}</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="mb-1 flex items-center justify-between">
                <StarRating rating={review.rating} />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(review.createdAt, { addSuffix: true, locale: dateLocale })}
                </span>
              </div>
              {review.title && <p className="mt-1 text-sm font-semibold">{review.title}</p>}
              <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>
              <p className="mt-2 text-xs font-medium">{review.authorName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
