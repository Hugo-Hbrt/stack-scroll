import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";

const AuthenticationPage = () => {
    
    return (
    <>
       <h1 className="text-center text-2xl font-family-sans">Authenticating from Reddit..</h1>
       <LoadingSpinner />
    </>);
}

export default AuthenticationPage;