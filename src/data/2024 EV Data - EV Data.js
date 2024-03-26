// Just copy the data from the google sheet (copy and paste the wanted columns)
// https://docs.google.com/spreadsheets/d/1jguNP8xd0ubyfc7M1t1TKkXkuHvl3a6ilOFFOn6sK4o/edit#gid=0
export const CARS_DATA = `
Lucid	Air	$77,400	500	https://lucidmotors.com/air
Rivian	R1T	$69,900	410	https://rivian.com/r1t
Rivian	R1S	$74,900	390	https://rivian.com/r1s
Hyundai	Ioniq 6	$42,450	361	https://www.hyundaiusa.com/us/en/vehicles/ioniq-6/compare-specs
Fisker	Ocean	$66,600	360	https://www.fiskerinc.com/ocean
Mercedes	EQS Sedan	$104,400	350	https://www.mbusa.com/en/vehicles/class/eqs/sedan
BMW	i7	$105,700	321	https://www.bmwusa.com/build-your-own.html#/series/i7/sedan
Polestar	2	$47,800	320	https://www.polestar.com/us/polestar-2
Cadillac	Lyriq	$58,590	314	https://www.cadillac.com/electric/lyriq
Acura	ZDX	$64,500	313	https://www.acura.com/suvs/zdx
BMW	iX	$87,100	311	https://www.bmwusa.com/build-your-own.html#/series/iX/sports-activity-vehicle
Kia	EV6	$42,600	310	https://www.kia.com/us/en/ev6
Mercedes	EQE Sedan	$74,900	305	https://www.mbusa.com/en/vehicles/class/eqe/sedan
Mercedes	EQS SUV	$104,400	305	https://www.mbusa.com/en/vehicles/class/eqs/suv
Nissan	Hummer EV	$43,190	304	https://www.nissanusa.com/vehicles/electric-cars/ariya.html
GMC		$97,175	303	https://www.gmc.com/electric/hummer-ev/suv
Hyundai	Ioniq 5	$41,800	303	https://www.hyundaiusa.com/us/en/vehicles/ioniq-5
Volvo	C40 Recharge	$53,600	297	https://www.volvocars.com/us/cars/c40-electric/?gad_source=1&gclid=Cj0KCQiA5rGuBhCnARIsAN11vgSBLJtxZlMfFoeHetQJaV2EjDzFM6hVHgKOBymDyPxdK9f7MX-DdmUaAk9AEALw_wcB&gclsrc=aw.ds
BMW	i5	$66,800	295	https://www.bmwusa.com/build-your-own.html#/series/i5/sedan
Genesis	GV60	$52,000	294	https://www.genesis.com/us/en/gv60
Genesis	GV70	$45,150	0	https://www.genesis.com/us/en/gv70
Volvo	XC40 Recharge	$52,450	293	https://www.volvocars.com/us/cars/xc40-electric
Audi	Q8 e-tron	$74,400	285	https://www.audiusa.com/us/web/en/models/q8-e-tron/q8-e-tron/2024/overview.html#
Genesis	Electrified GV70	$66,450	0	https://www.genesis.com/us/en/electrified-gv70
Genesis	GV80	$57,700	282	https://www.genesis.com/us/en/gv80
Mercedes	EQE SUV	$77,900	279	https://www.mbusa.com/en/vehicles/class/eqe/suv
BMW	i4	$52,200	276	https://www.bmwusa.com/build-your-own.html#/series/i4/gran-coupe
Volkswagen	ID.4	$38,995	275	https://www.vw.com/en/models/id-4
Audi	Q4 e-tron	$49,800	265	https://www.audiusa.com/us/web/en/models/electric-models.html
Hyundai	Kona Electric	$32,675	261	https://www.hyundaiusa.com/us/en/vehicles/kona-electric
Chevrolet	Bolt EV	$26,500	259	https://www.chevrolet.com/electric/bolt-ev
Audi	SQ8 e-tron	$89,000	253	https://www.audiusa.com/us/web/en/models/q8-e-tron/sq8-e-tron/2024/overview.html
Kia	EV9	$54,900	304	https://www.kia.com/us/en/ev9
Kia	Niro EV	$39,600	253	https://www.kia.com/us/en/niro-ev
Toyota	bZ4X	$43,070	252	https://www.toyota.com/bz4x/
Audi	e-tron GT	$106,500	249	https://www.audiusa.com/us/web/en/models/e-tron-gt/e-tron-gt/2024/overview.html
Chevrolet	Bolt EUV	$27,800	247	https://www.chevrolet.com/electric/bolt-euv
Jaguar	I-Pace	$72,000	246	https://buildyour.jaguarusa.com/jag2/r/products/_/en_us/i-pace_k24/4b4xo
Mercedes	EQB	$52,750	245	https://www.mbusa.com/en/vehicles/class/eqb
Porsche	Taycan Cross Turismo	$101,900	235	https://www.porsche.com/usa/models/taycan/taycan-models-1/taycan-4-cross-turismo/
Porsche	Taycan Sport Turismo	$141,200	233	https://www.porsche.com/usa/models/taycan/taycan-models-1/taycan-gts-sport-turismo/
Subaru	Solterra	$44,995	228	https://www.subaru.com/vehicles/solterra
Nissan	Leaf	$28,140	212	https://www.nissanusa.com/vehicles/electric-cars/leaf.html
Porsche	Taycan	$90,900	208	https://www.porsche.com/usa/models/taycan
Mini	Hardtop Cooper SE	$30,900	114	https://www.miniusa.com/model/electric-hardtop.html
Mercedes	EQS Maybach	$179,900	0	https://www.mbusa.com/en/vehicles/class/maybach-eqs/suv
`;

export const CARS_DATA_ARRAY = CARS_DATA.split("\n")
  .map((line) => {
    const [make, model, price, range, url] = line.split("\t");
    return { make, model, price, range, url };
  })
  .filter((car) => car.make && car.model && car.price && car.range && car.url);
