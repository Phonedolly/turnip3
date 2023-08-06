export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/writer/:newOrEpoch*", "/deploy", "/api/withAuth/:endpoint*"],
};
