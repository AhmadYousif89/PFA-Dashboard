import Wrapper from "./wrapper";

type Props = Readonly<{ children: React.ReactNode }>;

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="from-foreground to-accent bg-gradient-to-r from-50% to-50%">
      <Wrapper>{children}</Wrapper>
    </div>
  );
}
