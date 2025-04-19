import { v4 as uuid } from "uuid";

/**
 * Category Database can be added here.
 * You can add category of your wish with different attributes
 * */

export const categories = [
  {
    _id: uuid(),
    categoryName: "Dây chuyền",
    thumbnail: "/assets/categoryIcon/necklace.png",
  },
  {
    _id: uuid(),
    categoryName: "Vòng tay",
    thumbnail: "/assets/categoryIcon/bracelet.png",
  },
  {
    _id: uuid(),
    categoryName: "Nhẫn",
    thumbnail: "/assets/categoryIcon/ring.png",
  },
  {
    _id: uuid(),
    categoryName: "Bông tai",
    thumbnail: "/assets/categoryIcon/earring.png"
  }
];
