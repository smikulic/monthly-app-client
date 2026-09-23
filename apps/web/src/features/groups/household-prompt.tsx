import { useNavigate } from "react-router";
import { useMyGroupsQuery } from "@/generated/graphql";
import {
  HouseholdPromptStyled,
  HouseholdPromptTitleStyled,
  HouseholdPromptTextStyled,
  HouseholdPromptButtonStyled,
} from "./household-prompt-style";

/**
 * The way into a shared household, on the screen people actually open.
 *
 * Sharing was reachable only through the account dropdown into `/groups` — a
 * menu nobody opens unless they already know what is behind it. So the feature
 * the product is built around, and the one the pricing depends on, had no
 * entrance from any screen where people spend time.
 *
 * ## No dismiss button
 *
 * The obvious version remembers a dismissal in localStorage, and that is worse
 * than not offering one: clearing site data resurrects a prompt somebody
 * explicitly refused, which is how an app teaches people to stop reading what
 * it tells them. A durable refusal means a column on `User`, like
 * `onboardingSeenAt` — worth adding if this turns out to irritate anyone, and
 * not worth pre-empting.
 *
 * Instead it simply ends: the prompt is gone the moment a household exists,
 * which is the outcome it is asking for. Until then it is one non-modal card
 * beneath the figures people came to see.
 */
export const HouseholdPrompt = () => {
  const navigate = useNavigate();
  // Already in flight on this page — the toolbar's scope filter asks for the
  // same query — so this costs no extra request.
  const { data, loading } = useMyGroupsQuery({ fetchPolicy: "cache-first" });

  // Never render while the answer is unknown: someone who already has a
  // household should not watch "budget together" flash past on every load.
  if (loading) return null;
  if ((data?.myGroups ?? []).length > 0) return null;

  return (
    <HouseholdPromptStyled>
      <HouseholdPromptTitleStyled>
        Budget with the people you live with
      </HouseholdPromptTitleStyled>
      <HouseholdPromptTextStyled>
        Share a category and you both see the same figures, in the same month,
        with every expense recording who paid. No more keeping a tally in your
        head.
      </HouseholdPromptTextStyled>

      <HouseholdPromptButtonStyled
        type="button"
        onClick={() => navigate("/groups")}
        data-testid="household-prompt-invite"
      >
        Invite someone
      </HouseholdPromptButtonStyled>
    </HouseholdPromptStyled>
  );
};
