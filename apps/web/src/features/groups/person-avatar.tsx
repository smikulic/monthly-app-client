import { Avatar } from "@/components/ui/Avatar";

/**
 * A person, shown as a person.
 *
 * The groups page is entirely about people and had no avatars at all, so
 * someone was a recognisable colour in the yearly chart and an anonymous email
 * string on the page where you manage them.
 *
 * `color` comes from `getPersonColors`, which allocates by position within a
 * sorted list rather than by hashing the id. That guarantees distinct colours
 * inside one group — with six colours and a two-person household, hashing
 * would put both partners on the same colour about one time in six.
 */
export const PersonAvatar = ({
  name,
  color,
  picture,
  size = 32,
}: {
  name: string;
  color: string;
  picture?: string | null;
  size?: number;
}) => (
  <Avatar
    src={picture || undefined}
    alt={name}
    sx={{
      width: size,
      height: size,
      fontSize: size / 2.4,
      fontWeight: 600,
      bgcolor: color,
      // The person palette is mid-tone throughout, so a light label is legible
      // on every entry in it.
      color: "#FFFFFF",
      flexShrink: 0,
    }}
  >
    {!picture && name.charAt(0).toUpperCase()}
  </Avatar>
);

/**
 * Display name for someone who signed up by email and so has no `name`.
 * Mirrors what the header does rather than showing a raw address as the
 * primary label — a full address with a plus-tag reads as a string, not a
 * person.
 */
export const displayName = (name?: string | null, email?: string | null) =>
  name || email?.split("@")[0] || "Unknown";
