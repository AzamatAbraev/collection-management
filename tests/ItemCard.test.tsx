import { describe } from "node:test";
import { expect, it } from "vitest";
import ItemCard from "../src/components/card/ItemCard";
import { render, screen } from "@testing-library/react";
import React from "react";
import ItemType from "../src/types/item";

describe("ItemCard", () => {
  it("displays the item passed to it", () => {
    const testItem: ItemType = {
      name: "Book Title",
      _id: "book1",
      likes: ["user2"],
      photo: 'url_to_photo',
      collectionId: { name: 'Science Fiction', _id: "collection1" },
      userId: { username: 'JohnDoe', _id: "user1" },
      customValues: [{fieldName: "author", fieldValue: "John Doe"}],
      tags: ["sci-fi", "adventure"],
      createdAt: "2022-01-01T00:00:00.000Z",
      updatedAt: "2022-01-01T00:00:00.000Z",
    };
    render(<ItemCard item={testItem} />);
    expect(screen.getByText("Book Title"));
    expect(screen.getByText("Science Fiction"));
    expect(screen.getByText("Published by JohnDoe"));
  })
})