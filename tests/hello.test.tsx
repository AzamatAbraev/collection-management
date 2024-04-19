import { describe, it, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import HelloPage from "../src/mock-test/hello";
import React from "react";

describe("Hello", () => {
  it("it should display name passed to it", () => {
    const name = "Arnie";
    render(<HelloPage name={name}/>)
    expect(screen.getByText(name));
  });
})  