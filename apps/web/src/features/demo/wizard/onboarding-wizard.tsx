import { useContext, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/react";
import { UserContext } from "@/App";
import { FormDialog } from "@/components/form-dialog/form-dialog";
import { formatAmount } from "@/utils/format";
import {
  CREATE_CATEGORY_MUTATION,
  CREATE_SUBCATEGORY_MUTATION,
} from "@/pages/categories-page/categories-page-queries";
import { starterBudget } from "./starter-budget";
import {
  WizardAmountInputStyled,
  WizardFooterStyled,
  WizardGroupHeaderStyled,
  WizardGroupStyled,
  WizardGroupTotalStyled,
  WizardIntroStyled,
  WizardLineStyled,
  WizardSkipStyled,
  WizardTotalStyled,
} from "./onboarding-wizard-style";

/** Working copy: the starter set with the user's choices applied. */
interface Draft {
  name: string;
  selected: boolean;
  lines: { name: string; amount: number | "" }[];
}

const toDraft = (): Draft[] =>
  starterBudget.map((category) => ({
    name: category.name,
    selected: category.selected,
    lines: category.lines.map((line) => ({ ...line })),
  }));

const sumOf = (draft: Draft) =>
  draft.lines.reduce((total, line) => total + (Number(line.amount) || 0), 0);

/**
 * The last step of onboarding: turn the demo into the user's own budget.
 *
 * Everything here is skippable, in both senses — the dialog can be dismissed
 * outright, and every category and amount inside it can be changed. It exists
 * to save twenty minutes of typing, not to decide how anyone should live.
 */
export const OnboardingWizard = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const userCurrency = useContext(UserContext);
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft[]>(toDraft);
  const [saving, setSaving] = useState(false);

  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION);
  const [createSubcategory] = useMutation(CREATE_SUBCATEGORY_MUTATION);

  const chosen = useMemo(() => draft.filter((d) => d.selected), [draft]);
  const total = useMemo(
    () => chosen.reduce((sum, category) => sum + sumOf(category), 0),
    [chosen],
  );

  const toggle = (name: string) =>
    setDraft((current) =>
      current.map((category) =>
        category.name === name
          ? { ...category, selected: !category.selected }
          : category,
      ),
    );

  const setAmount = (categoryName: string, lineName: string, value: string) =>
    setDraft((current) =>
      current.map((category) =>
        category.name !== categoryName
          ? category
          : {
              ...category,
              lines: category.lines.map((line) =>
                line.name === lineName
                  ? // `""`, not 0: `Number("")` is 0, so coercing on every
                    // keystroke rewrites a cleared field as zero — on money.
                    { ...line, amount: value === "" ? "" : Number(value) }
                  : line,
              ),
            },
      ),
    );

  const create = async () => {
    setSaving(true);

    // The first of this month: budgets are monthly, and starting the schedule
    // mid-month would leave the opening period ambiguous.
    const validFrom = dayjs().startOf("month").format("YYYY-MM-DD");

    try {
      for (const category of chosen) {
        const { data } = await createCategory({
          variables: { name: category.name },
        });
        const categoryId = data?.createCategory?.id;
        if (!categoryId) continue;

        for (const line of category.lines) {
          const amount = Number(line.amount) || 0;
          // A zero-budget line is a row that can never be under or over, so it
          // is treated as "not this one" rather than created empty.
          if (amount <= 0) continue;

          await createSubcategory({
            variables: {
              categoryId,
              name: line.name,
              budgetAmount: amount,
              validFrom,
            },
          });
        }
      }

      toast.success("Your budget is ready");
      onClose();
      navigate("/budget");
    } catch (error) {
      // Partial creation is possible and survivable: whatever was created is
      // real and editable, so the honest thing is to say so and let them
      // continue rather than silently retry.
      Sentry.captureException(error);
      toast.error("Some categories could not be created. Check your budget.");
      onClose();
      navigate("/budget");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormDialog
      open={open}
      title="Set up your budget"
      formActionText={
        saving
          ? "Creating…"
          : chosen.length === 0
            ? "Pick at least one"
            : `Create ${chosen.length} ${chosen.length === 1 ? "category" : "categories"}`
      }
      disabled={saving || chosen.length === 0}
      formAction={create}
      closeForm={onClose}
    >
      <WizardIntroStyled>
        A starting point, not a prescription. Untick what you don&apos;t need
        and change any amount — all of it is editable later.
      </WizardIntroStyled>

      {draft.map((category) => (
        <WizardGroupStyled key={category.name}>
          <WizardGroupHeaderStyled selected={category.selected}>
            <input
              type="checkbox"
              checked={category.selected}
              onChange={() => toggle(category.name)}
            />
            {category.name}
            <WizardGroupTotalStyled>
              {formatAmount(sumOf(category), userCurrency)}
            </WizardGroupTotalStyled>
          </WizardGroupHeaderStyled>

          {category.selected &&
            category.lines.map((line) => (
              <WizardLineStyled key={line.name}>
                <span>{line.name}</span>
                <WizardAmountInputStyled
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={line.amount}
                  aria-label={`${category.name}: ${line.name}`}
                  onChange={(event) =>
                    setAmount(category.name, line.name, event.target.value)
                  }
                />
              </WizardLineStyled>
            ))}
        </WizardGroupStyled>
      ))}

      <WizardFooterStyled>
        <WizardSkipStyled type="button" onClick={onClose}>
          Skip — I&apos;ll start from scratch
        </WizardSkipStyled>
        <span>
          <WizardTotalStyled>
            {formatAmount(total, userCurrency)}
          </WizardTotalStyled>{" "}
          a month
        </span>
      </WizardFooterStyled>
    </FormDialog>
  );
};
