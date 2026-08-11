import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CouponForm } from "@/components/admin/coupon-form";
import { CouponRowActions } from "@/components/admin/coupon-row-actions";
import { getAllCoupons } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils";

export default async function AdminCouponsPage() {
  const [coupons, t] = await Promise.all([getAllCoupons(), getTranslations("AdminCoupons")]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("codesTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("colCode")}</TableHead>
                  <TableHead>{t("colType")}</TableHead>
                  <TableHead>{t("colValue")}</TableHead>
                  <TableHead>{t("colUsage")}</TableHead>
                  <TableHead>{t("colStatus")}</TableHead>
                  <TableHead className="text-right">{t("colActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                    <TableCell>{coupon.type.replace("_", " ")}</TableCell>
                    <TableCell>
                      {coupon.type === "PERCENTAGE"
                        ? `${coupon.value}%`
                        : coupon.type === "FIXED_AMOUNT"
                        ? formatPrice(coupon.value)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {coupon.timesUsed}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? "success" : "secondary"}>
                        {coupon.isActive ? t("active") : t("disabled")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <CouponRowActions couponId={coupon.id} isActive={coupon.isActive} />
                    </TableCell>
                  </TableRow>
                ))}
                {coupons.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                      {t("noCoupons")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("newCouponTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CouponForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
