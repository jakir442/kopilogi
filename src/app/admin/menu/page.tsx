import { getMenus } from "@/features/menu/actions/menu.actions";
import { MenuManagement } from "@/features/menu/components/admin/menu-management";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const result = await getMenus();

  return <MenuManagement initialMenus={result.success ? ((result.data ?? []) as never[]) : []} />;
}
