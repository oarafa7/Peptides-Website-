import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Link } from "@/i18n/navigation";
import { getAllProductsForAdmin } from "@/lib/data/admin";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const [products, t] = await Promise.all([getAllProductsForAdmin(), getTranslations("AdminProducts")]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("count", { count: products.length })}</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" /> {t("newProduct")}
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("colTitle")}</TableHead>
              <TableHead>{t("colStatus")}</TableHead>
              <TableHead>{t("colCategory")}</TableHead>
              <TableHead>{t("colPrice")}</TableHead>
              <TableHead>{t("colStock")}</TableHead>
              <TableHead>{t("colVariants")}</TableHead>
              <TableHead className="text-right">{t("colActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>
                  <Badge variant={product.status === "ACTIVE" ? "success" : "secondary"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>{product.category?.name ?? "—"}</TableCell>
                <TableCell>{formatPrice(product.priceCents)}</TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>{product.variants.length}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/products/${product.id}`}>{t("edit")}</Link>
                    </Button>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                  {t("noProducts")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
