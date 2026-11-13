import { Suspense } from "react";
import { HomeRedirect } from "@/components/auth/home-redirect";

export default function HomePage() {
    return (
        <Suspense>
            <HomeRedirect />
        </Suspense>
    );
}
