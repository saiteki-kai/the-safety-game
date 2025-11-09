import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import type { MemberSlot } from "@/components/dashboard/types";
import TeamOverviewCard from "@/components/dashboard/view/TeamOverviewCard";

describe("TeamOverviewCard", () => {
  it("renders with no members", () => {
    const memberSlots: MemberSlot[] = [
      { key: "1", name: "SLOT", isPlaceholder: true, initials: "+" },
      { key: "2", name: "SLOT", isPlaceholder: true, initials: "+" },
      { key: "3", name: "SLOT", isPlaceholder: true, initials: "+" },
      { key: "4", name: "SLOT", isPlaceholder: true, initials: "+" },
    ];

    render(<TeamOverviewCard teamName="Test Team" teamJoinCode="TEST123" memberSlots={memberSlots} />);

    expect(screen.getByText("Test Team")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getAllByText("SLOT")).toHaveLength(4);
  });

  it("renders 1 member and 3 empty slots", () => {
    const memberSlots = [
      { key: "1", name: "Alice", isPlaceholder: false, initials: "A" },
      { key: "2", name: "SLOT", isPlaceholder: true, initials: "+" },
      { key: "3", name: "SLOT", isPlaceholder: true, initials: "+" },
      { key: "4", name: "SLOT", isPlaceholder: true, initials: "+" },
    ];

    render(<TeamOverviewCard teamName="Test Team" teamJoinCode="TEST123" memberSlots={memberSlots} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getAllByText("SLOT")).toHaveLength(3);
  });

  it("renders 3 member items and 1 empty slot", () => {
    const mockMemberSlots: MemberSlot[] = [
      { key: "1", name: "Alice", isPlaceholder: false, initials: "A" },
      { key: "2", name: "Bob", isPlaceholder: false, initials: "B" },
      { key: "3", name: "Charlie", isPlaceholder: false, initials: "C" },
      { key: "4", name: "SLOT", isPlaceholder: true, initials: "+" },
    ];

    render(<TeamOverviewCard teamName="Test Team" teamJoinCode="TEST123" memberSlots={mockMemberSlots} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("SLOT")).toBeInTheDocument();
  });

  it("renders all member slots", () => {
    const mockMemberSlots: MemberSlot[] = [
      { key: "1", name: "Alice", isPlaceholder: false, initials: "A" },
      { key: "2", name: "Bob", isPlaceholder: false, initials: "B" },
      { key: "3", name: "Charlie", isPlaceholder: false, initials: "C" },
      { key: "4", name: "David", isPlaceholder: false, initials: "D" },
    ];

    render(<TeamOverviewCard teamName="Test Team" teamJoinCode="TEST123" memberSlots={mockMemberSlots} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("David")).toBeInTheDocument();
  });
});
