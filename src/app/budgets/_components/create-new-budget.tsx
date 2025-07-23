import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const CreateNewBudget = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="min-h-14">+ Add New Budget</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent></DropdownMenuContent>
    </DropdownMenu>
  );
};
