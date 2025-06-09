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
  className="w-full h-11 text-white border-zinc-200 flex items-center justify-center text-sm md:text-base"
>
  <img
    src="/google.png"
    alt="Google"
    className="w-5 h-5"
    loading="lazy"
  />
  <span className="hidden md:inline-block ml-2">Continue with Google</span>
</Button>

    );
};

export default SignInOAuthButtons;
