import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
    const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const signInWithGoogle = () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback",
        });
    };

    return (
     <Button
  onClick={signInWithGoogle}
  variant="secondary"
  className="w-full h-11 text-white border-zinc-200 flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base"
>
  <img
    src="/google.png"
    alt="Google"
    className="w-4 h-4 md:w-5 md:h-5"
    loading="lazy"
  />
  <span className="hidden md:block">Continue with Google</span>
</Button>
    );
};

export default SignInOAuthButtons;
