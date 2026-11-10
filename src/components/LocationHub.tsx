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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
        <h5 className="text-gray-400 text-xs uppercase tracking-wider font-bold text-center sm:text-left">
          Browse Verified Escorts by Location
        </h5>
        <span className="text-[11px] text-gray-500 text-center sm:text-right">
          Direct WhatsApp contact with independent companions across Uganda
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2.5">
        {/* Kampala Suburbs */}
        {kampalaSuburbs.map((suburb) => (
          <Link 
            key={suburb} 
            href={`/escorts-in/kampala/${suburb}`}
            className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] capitalize truncate"
            title={`Verified Escorts in ${suburb.replace(/-/g, ' ')}`}
          >
            {suburb.replace(/-/g, ' ')}
          </Link>
        ))}
        
        {/* All Major Cities in Uganda */}
        {cities.map((city) => (
          <Link 
            key={city} 
            href={`/escorts-in/${city}`}
            className="text-gray-300 hover:text-pink-400 transition-colors text-[11px] capitalize font-medium truncate"
            title={`Verified Escorts in ${city.replace(/-/g, ' ')}`}
          >
            {city.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>
      
      <div className="mt-6 flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 border-t border-gray-900/40 pt-4">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Categories:</span>
        <Link href="/thick-escorts-in/kampala" className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] font-medium">Thick Companions</Link>
        <Link href="/slim-escorts-in/kampala" className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] font-medium">Slim Companions</Link>
        <Link href="/curvy-escorts-in/kampala" className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] font-medium">Curvy Beauties</Link>
        <Link href="/vip-escorts-in/kampala" className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] font-medium">VIP Escorts</Link>
        <Link href="/massage-escorts-in/kampala" className="text-gray-400 hover:text-pink-400 transition-colors text-[11px] font-medium">Sensual Massage</Link>
      </div>
    </div>
  );
};

export default LocationHub;
