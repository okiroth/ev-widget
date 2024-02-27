// Just copy the data from the google sheet (copy and paste the wanted columns)
// https://docs.google.com/spreadsheets/d/1Xifx_6hkbYCXAYAR0IWlZEn40fi56a9k8q8_stU6pr4/edit#gid=0
export const CARS_DATA = `
Audi	Q4 e-tron	$49,800	265	https://www.audiusa.com/us/web/en/models/electric-models.html
Audi	Q8 e-tron	$74,400	285	https://www.audiusa.com/us/web/en/models/q8-e-tron/q8-e-tron/2024/overview.html#
Audi	SQ8 e-tron	$89,000	253	https://www.audiusa.com/us/web/en/models/q8-e-tron/sq8-e-tron/2024/overview.html
Audi	e-tron GT	$106,500	249	https://www.audiusa.com/us/web/en/models/e-tron-gt/e-tron-gt/2024/overview.html
BMW	iX	$87,100	311	https://www.bmwusa.com/build-your-own.html#/series/iX/sports-activity-vehicle
BMW	i4	$52,200	276	https://www.bmwusa.com/build-your-own.html#/series/i4/gran-coupe
BMW	i5	$66,800	295	https://www.bmwusa.com/build-your-own.html#/series/i5/sedan
BMW	i7	$105,700	321	https://www.bmwusa.com/build-your-own.html#/series/i7/sedan
Cadillac	Lyriq	$58,590	314	https://www.cadillac.com/electric/lyriq
Chevrolet	Bolt EUV	$27,800	247	https://www.chevrolet.com/electric/bolt-euv
Chevrolet	Bolt EV	$26,500	259	https://www.chevrolet.com/electric/bolt-ev
Fisker	Ocean	$66,600	360	https://www.fiskerinc.com/ocean
Genesis	Electrified G80	$74,375	282	https://www.genesis.com/us/en/electrified-g80
Genesis	GV60	$52,000	294	https://www.genesis.com/us/en/gv60
GMC	Hummer EV	$97,175	303	https://www.gmc.com/electric/hummer-ev/suv
Hyundai	Kona Electric	$32,675	261	https://www.hyundaiusa.com/us/en/vehicles/kona-electric
Hyundai	Ioniq 5	$41,800	303	https://www.hyundaiusa.com/us/en/vehicles/ioniq-5
Hyundai	Ioniq 6	$42,450	361	https://www.hyundaiusa.com/us/en/vehicles/ioniq-6/compare-specs
Jaguar	I-Pace	$72,000	246	https://buildyour.jaguarusa.com/jag2/r/products/_/en_us/i-pace_k24/4b4xo
Kia	EV6	$42,600	310	https://www.kia.com/us/en/ev6
Kia	Niro EV	$39,600	253	https://www.kia.com/us/en/niro-ev
Lucid	Air	$77,400	500	https://lucidmotors.com/air
Mercedes	EQB	$52,750	245	https://www.mbusa.com/en/vehicles/class/eqb
Mercedes	EQE Sedan	$74,900	305	https://www.mbusa.com/en/vehicles/class/eqe/sedan
Mercedes	EQE SUV	$77,900	279	https://www.mbusa.com/en/vehicles/class/eqe/suv
Mercedes	EQS Sedan	$104,400	350	https://www.mbusa.com/en/vehicles/class/eqs/sedan
Mercedes	EQS SUV	$104,400	305	https://www.mbusa.com/en/vehicles/class/eqs/suv
Mercedes	EQS Maybach	$179,900		https://www.mbusa.com/en/vehicles/class/maybach-eqs/suv
Mini	Hardtop Cooper SE	$30,900	114	https://www.miniusa.com/model/electric-hardtop.html
Nissan	Ariya	$43,190	304	https://www.nissanusa.com/vehicles/electric-cars/ariya.html
Nissan	Leaf	$28,140	212	https://www.nissanusa.com/vehicles/electric-cars/leaf.html
Polestar	2	$47,800	320	https://www.polestar.com/us/polestar-2
Porsche	Taycan	$90,900	208	https://www.porsche.com/usa/models/taycan
Porsche	Taycan Sport Turismo	$141,200	233	https://www.porsche.com/usa/models/taycan/taycan-models-1/taycan-gts-sport-turismo/
Porsche	Taycan Cross Turismo	$101,900	235	https://www.porsche.com/usa/models/taycan/taycan-models-1/taycan-4-cross-turismo/
Rivian	R1S	$74,900	390	https://rivian.com/r1s
Rivian	R1T	$69,900	410	https://rivian.com/r1t
Subaru	Solterra	$44,995	228	https://www.subaru.com/vehicles/solterra
Toyota	bZ4X	$43,070	252	https://www.toyota.com/bz4x/
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
