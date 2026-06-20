import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SearchStatus from "./SearchStatus";

describe("SearchStatus", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders nothing when the query is blank", () => {
    const { container } = render(
      <SearchStatus
        query=""
        resultCount={0}
        resultsLabel={(count) => `${count} resultats`}
        nothingFoundLabel="Res trobat"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("announces result counts for screen readers", () => {
    render(
      <SearchStatus
        query="barbacoa"
        resultCount={2}
        resultsLabel={(count) => `${count} resultats`}
        nothingFoundLabel="Res trobat"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("2 resultats");
  });

  it("announces empty states for screen readers", () => {
    render(
      <SearchStatus
        query="xyz"
        resultCount={0}
        resultsLabel={(count) => `${count} resultats`}
        nothingFoundLabel="Res trobat"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Res trobat");
  });
});
