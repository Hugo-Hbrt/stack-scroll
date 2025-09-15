import AppLogo, { AppLogoSize } from "@components/AppLogo/AppLogo";

const LoadingSpinner = () => {
    return (<div
            data-testid="loading-spinner"
            className="flex justify-center my-4"
            role="status"
            aria-live="polite"
            aria-label="Loading posts"
          >
            <AppLogo size={AppLogoSize.Medium} className="animate-spin" />
          </div>);
}

export default LoadingSpinner;