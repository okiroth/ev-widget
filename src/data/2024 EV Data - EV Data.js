// Just copy the data from the google sheet (copy and paste the wanted columns)
// https://docs.google.com/spreadsheets/d/1Xifx_6hkbYCXAYAR0IWlZEn40fi56a9k8q8_stU6pr4/edit#gid=0
export const CARS_DATA = `
Audi	Q4 e-tron	$49,800	265	https://www.audiusa.com/us/web/en/models/electric-models.html
Audi	Q8 e-tron	$74,400	285	https://www.audiusa.com/us/web/en/models/q8-e-tron/q8-e-tron/2024/overview.html
Audi	SQ8 e-tron	$89,000	253	https://www.audiusa.com/us/web/en/models/q8-e-tron/sq8-e-tron/2024/overview.html
BMW	iX	$87,100	311	https://www.bmwusa.com/build-your-own.html#/series/iX/sports-activity-vehicle
BMW	i4	$52,200	276	https://www.bmwusa.com/build-your-own.html#/series/i4/gran-coupe
BMW	i5	$66,800	295	https://www.bmwusa.com/build-your-own.html#/series/i5/sedan
BMW	i7	$105,700	321	https://www.bmwusa.com/build-your-own.html#/series/i7/sedan
Cadillac	Lyriq	$58,590	314	https://www.cadillac.com/electric/lyriq
Chevrolet	Bolt EUV	$27,800	247	https://www.chevrolet.com/electric/bolt-euv
Chevrolet	Bolt EV	$26,500	259	https://www.chevrolet.com/electric/bolt-ev
Genesis	Electrified G80	$74,375	282	https://www.genesis.com/us/en/electrified-g80
Genesis	GV60	$52,000	294	https://www.genesis.com/us/en/gv60
Hyundai	Kona Electric	$32,675	261	https://www.hyundaiusa.com/us/en/vehicles/kona-electric
Hyundai	Ioniq 5	$41,800	303	https://www.hyundaiusa.com/us/en/vehicles/ioniq-5
Hyundai	Ioniq 6	$42,450	361	https://www.hyundaiusa.com/us/en/vehicles/ioniq-6/compare-specs
Kia	EV6	$42,600	310	https://www.kia.com/us/en/ev6
Kia	Niro EV	$39,600	253	https://www.kia.com/us/en/niro-ev
Mercedes-Benz	EQB	$52,750	245	https://www.mbusa.com/en/vehicles/class/eqb
Mercedes-Benz	EQE Sedan	$74,900	305	https://www.mbusa.com/en/vehicles/class/eqe/sedan
Mercedes-Benz	EQE SUV	$77,900	279	https://www.mbusa.com/en/vehicles/class/eqe/suv
Mercedes-Benz	EQS Sedan	$104,400	350	https://www.mbusa.com/en/vehicles/class/eqs/sedan
Mercedes-Benz	EQS SUV	$104,400	305	https://www.mbusa.com/en/vehicles/class/eqs/suv
Mercedes-Benz	EQS Maybach	$179,900		https://www.mbusa.com/en/vehicles/class/maybach-eqs/suv
Mini	Hardtop Cooper SE	$30,900	114	https://www.miniusa.com/model/electric-hardtop.html
Nissan	Leaf	$28,140	212	https://www.nissanusa.com/vehicles/electric-cars/leaf.html
Porsche	Taycan	$90,900	208	https://www.porsche.com/usa/models/taycan
Porsche	Taycan Cross Turismo	$101,900	235	https://www.porsche.com/usa/models/taycan/taycan-models-1/taycan-4-cross-turismo/
Subaru	Solterra	$44,995	228	https://www.subaru.com/vehicles/solterra
Volkswagen	ID.4	$38,995	275	https://www.vw.com/en/models/id-4
Volvo	C40 Recharge	$53,600	297	https://www.volvocars.com/us/cars/c40-electric/?gad_source=1&gclid=Cj0KCQiA5rGuBhCnARIsAN11vgSBLJtxZlMfFoeHetQJaV2EjDzFM6hVHgKOBymDyPxdK9f7MX-DdmUaAk9AEALw_wcB&gclsrc=aw.ds
Volvo	XC40 Recharge	$52,450	293	https://www.volvocars.com/us/cars/xc40-electric
`;

export const CARS_DATA_ARRAY = CARS_DATA.split("\n")
  .map((line) => {
    const [make, model, price, range, url] = line.split("\t");
    return { make, model, price, range, url };
  })
  .filter((car) => car.make && car.model && car.price && car.range && car.url);
