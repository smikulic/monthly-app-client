import { gql } from "@apollo/client";

/**
 * The dataset is fetched rather than bundled: a year of demo expenses is dead
 * weight in the main bundle for every visitor who never opens the demo, and
 * fetching it means the content can be rewritten server-side without a client
 * release.
 */
export const GET_DEMO_DATASET = gql`
  query DemoDataset {
    demoDataset {
      key
      version
      payload
    }
  }
`;

export const MARK_ONBOARDING_SEEN = gql`
  mutation MarkOnboardingSeen {
    markOnboardingSeen {
      id
      onboardingSeenAt
    }
  }
`;

export const REPLAY_ONBOARDING = gql`
  mutation ReplayOnboarding {
    replayOnboarding {
      id
      onboardingSeenAt
    }
  }
`;
