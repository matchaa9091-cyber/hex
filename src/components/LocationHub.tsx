import Link from "next/link";

const kampalaSuburbs = [
  // Top Active Hubs (with direct resident profiles)
  "kawempe", "kasubi", "kyanja", "mengo", "bukoto", "makindye",
  "munyonyo", "rubaga", "salaama", "kisaasi", "makerere", "gayaza-road",
  "kololo", "ntinda", "bwaise", "kalerwe", "kansanga", "masanafu",
  "najjanankumbi", "namasuba", "nankulabye", "ndejje", "nsambya", "old-kampala",
  "kira", "zana",
  // Prime Greater Kampala Suburbs
  "nakasero", "bugolobi", "naguru", "najjera", "muyenga", "kabalagala",
  "luzira", "kamwokya", "naalya", "namugongo", "kyaliwajjala", "buziga",
  "gaba", "bunga", "lubowa", "seguku", "kiwatule"
];

const cities = [
  // Active Cities with Resident Companions
  "entebbe", "mukono", "jinja", "mbarara", "fort-portal", "arua", "wakiso",
  // Major Regional Urban Centers across Uganda
  "gulu", "masaka", "mbale", "tororo", "lira", "hoima", "kasese", "soroti", "kabale"
];

const LocationHub = () => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-900/50">
      <h5 className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-6 text-center md:text-left">
        Browse by Area &amp; City
      </h5>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-3">
        {/* Kampala Suburbs */}
        {kampalaSuburbs.map((suburb) => (
          <Link 
            key={suburb} 
            href={`/escorts-in/kampala/${suburb}`}
            className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] capitalize"
          >
            {suburb.replace(/-/g, ' ')} Escorts
          </Link>
        ))}
        
        {/* All Major Cities in Uganda */}
        {cities.map((city) => (
          <Link 
            key={city} 
            href={`/escorts-in/${city}`}
            className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] capitalize font-medium"
          >
            {city.replace(/-/g, ' ')} Escorts
          </Link>
        ))}
      </div>
      
      <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 border-t border-gray-900/30 pt-6">
        <Link href="/thick-escorts-in/kampala" className="text-gray-500 hover:text-pink-400 transition-colors text-[10px] font-medium">Thick Escorts Kampala</Link>
        <Link href="/slim-escorts-in/kampala" className="text-gray-500 hover:text-pink-400 transition-colors text-[10px] font-medium">Slim Escorts Kampala</Link>
        <Link href="/curvy-escorts-in/kampala" className="text-gray-500 hover:text-pink-400 transition-colors text-[10px] font-medium">Curvy Escorts Kampala</Link>
        <Link href="/vip-escorts-in/kampala" className="text-gray-500 hover:text-pink-400 transition-colors text-[10px] font-medium">VIP Escorts Kampala</Link>
        <Link href="/massage-escorts-in/kampala" className="text-gray-500 hover:text-pink-400 transition-colors text-[10px] font-medium">Massage Kampala</Link>
      </div>
    </div>
  );
};

export default LocationHub;
