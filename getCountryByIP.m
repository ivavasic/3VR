% Legacy helper. Update this file.

function country = getCountryByIP( ipv4 )
    url = sprintf( 'enter your api', ipv4 ) ;
    buf = urlread( url ) ;
    country = regexp( buf, '(?<=countryName":")[^"]*', 'match', 'once' )  ;
 end