import ReactCountryFlag from "react-country-flag";

export function countryCodeToFlag(countryCode: string): JSX.Element {
  // Handle EU (European Union) which doesn't have a standard ISO code
  if (countryCode === 'EU') {
    return (
      <div 
        style={{
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          lineHeight: '1',
        }}
        title="European Union"
      >
        🇪🇺
      </div>
    );
  }

  return (
    <ReactCountryFlag
      countryCode={countryCode}
      svg
      style={{
        width: '2.5rem',
        height: '2.5rem',
        objectFit: 'cover',
      }}
      title={countryCode}
    />
  );
}
