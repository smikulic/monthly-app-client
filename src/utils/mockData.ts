const mockCategoryId1 = "categoryId1";
const mockSubcategoryId1 = "subCategoryId1";
const mockSubcategoryId2 = "subCategoryId2";

export const categoryMock1 = {
  id: mockCategoryId1,
  name: "TestCategory1",
  subcategories: [
    {
      id: mockSubcategoryId1,
      categoryId: mockCategoryId1,
      name: "TestSubcategory1",
      createdAt: "",
      rolloverDate: "",
      budgetAmount: 100,
    },
    {
      id: mockSubcategoryId2,
      categoryId: mockCategoryId1,
      name: "TestSubcategory1",
      createdAt: "",
      rolloverDate: "",
      budgetAmount: 200,
    },
  ],
};

export const expenseMock1 = {
  id: "expenseId1",
  subcategoryId: mockSubcategoryId1,
  amount: 50,
  date: "",
};

export const expenseMock2 = {
  id: "expenseId2",
  subcategoryId: mockSubcategoryId2,
  amount: 150,
  date: "",
};
