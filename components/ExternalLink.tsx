import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { ComponentType } from "react";
import { Platform } from "react-native";

type Props = Omit<ComponentType<typeof Link>, "href"> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      {...rest}
      target="_blank"
      to={href}
      onPress={async (event: any) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
