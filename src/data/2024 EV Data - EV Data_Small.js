// Just copy the data from the google sheet (copy and paste the wanted columns)
// https://docs.google.com/spreadsheets/d/1Xifx_6hkbYCXAYAR0IWlZEn40fi56a9k8q8_stU6pr4/edit#gid=0
export const CARS_DATA_SMALL = `
Audi	Q4 e-tron	$49,800	265	https://www.audiusa.com/us/web/en/models/electric-models.html
Mercedes-Benz	EQS SUV	$104,400	305	https://www.mbusa.com/en/vehicles/class/eqs/suv
Subaru	Solterra	$44,995	228	https://www.subaru.com/vehicles/solterra
`;

export const CARS_DATA_ARRAY_SMALL = CARS_DATA_SMALL.split("\n")
  .map((line) => {
    const [make, model, price, range, url] = line.split("\t");
    return { make, model, price, range, url };
  })
  .filter((car) => car.make && car.model && car.price && car.range && car.url);
