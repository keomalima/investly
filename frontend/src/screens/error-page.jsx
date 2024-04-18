import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  // Sets the default error page
  return (
    <div className='flex-error'>
      <h1 className='strong md'>Oops!</h1>
      <p className='normal'>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
