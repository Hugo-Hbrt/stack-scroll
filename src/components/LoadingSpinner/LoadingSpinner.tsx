import AppLogo, { AppLogoSize } from "@components/AppLogo/AppLogo";

export interface LoadingSpinnerProps {
  ariaLabel?: string;
}

const LoadingSpinner = ({ariaLabel} : LoadingSpinnerProps) => {
    return (<div
            data-testid="loading-spinner"
            className="flex justify-center my-4"
            role="status"
            aria-live="polite"
            aria-label={ariaLabel}
          >
            <AppLogo size={AppLogoSize.Medium} className="animate-spin" />
          </div>);
}

export default LoadingSpinner;