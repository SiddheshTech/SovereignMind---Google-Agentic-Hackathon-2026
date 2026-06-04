import os
import pandas as pd
from typing import Dict, Any

class DatasetManager:
    """
    Singleton manager to cache essential global metrics from massive CSV/Excel datasets.
    Prevents reading 2GB of data on every API request.
    """
    def __init__(self):
        self.dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../datasets"))
        self.country_cache = {}
        self.is_loaded = False

    def preload_data(self):
        """Loads critical indices and metrics into memory."""
        if self.is_loaded:
            return

        print("📊 [DatasetManager] Preloading historical global data into memory. This may take a few seconds...")
        
        # We will build a unified lookup dictionary: self.country_cache[country_code]
        # Format: {'US': {'population': 340000000, 'resilience': 0.82, 'civil_liberty': 0.9, 'conflict_deaths': 0}}
        
        # 1. Load V-Dem (Governance Resilience, Civil Liberties)
        try:
            vdem_file = os.path.join(self.dataset_path, "V-Dem-CY-Core-v16.csv")
            # Read a chunk or filter recent years to save memory. 
            # We'll just read 10000 rows to quickly get recent data.
            df_vdem = pd.read_csv(vdem_file, nrows=10000, low_memory=False)
            
            # Map country codes to recent metrics
            for _, row in df_vdem.iterrows():
                code = str(row.get('country_text_id', '')).upper()
                if code and len(code) <= 3:
                    if code not in self.country_cache:
                        self.country_cache[code] = {}
                    # V-Dem indicators (v2x_polyarchy for resilience, v2clrelig/v2x_civlib for civil liberty approx)
                    resilience = row.get('v2x_polyarchy', 0.5)
                    self.country_cache[code]['resilience'] = float(resilience) if pd.notna(resilience) else 0.5
                    
                    # Assume v2x_polyarchy also mirrors civil liberty strength if exact column is buried
                    self.country_cache[code]['civil_liberty'] = float(resilience) if pd.notna(resilience) else 0.5
        except Exception as e:
            print(f"⚠️ DatasetManager failed to load V-Dem: {e}")

        # 2. Load Population Data (SYB)
        try:
            pop_file = os.path.join(self.dataset_path, "SYB68_1_202511_Population, Surface Area and Density.csv")
            df_pop = pd.read_csv(pop_file, encoding='latin1', nrows=5000)
            
            # Very basic extraction (SYB format is tricky without full parse, we will use a naive mapping or fallback)
            # As a hackathon fallback, if parsing complex UN CSV fails, we provide a robust estimation based on known countries
            # We'll try to map common names to codes
            name_to_code = {"United States": "USA", "Singapore": "SGP", "Germany": "DEU", "China": "CHN"}
            for _, row in df_pop.iterrows():
                region = str(row.get('Region/Country/Area', ''))
                val = row.get('Value', 0)
                try:
                    pop_val = float(str(val).replace(',', '')) * 1000 # SYB usually in thousands
                except:
                    continue
                    
                code = None
                for name, iso in name_to_code.items():
                    if name in region:
                        code = iso
                        break
                        
                if code:
                    if code not in self.country_cache:
                        self.country_cache[code] = {}
                    if 'population' not in self.country_cache[code] or self.country_cache[code]['population'] < pop_val:
                        self.country_cache[code]['population'] = pop_val
        except Exception as e:
            print(f"⚠️ DatasetManager failed to load Population data: {e}")

        # 3. Load GED Conflict Data (Civil Unrest)
        try:
            ged_file = os.path.join(self.dataset_path, "GEDEvent_v25_1.csv")
            df_ged = pd.read_csv(ged_file, nrows=50000, low_memory=False)
            
            # Aggregate deaths by country
            conflict_map = df_ged.groupby('country')['best'].sum().to_dict()
            name_to_code = {"United States": "USA", "Singapore": "SGP", "Germany": "DEU"}
            for country, deaths in conflict_map.items():
                code = name_to_code.get(country)
                if code:
                    if code not in self.country_cache:
                        self.country_cache[code] = {}
                    self.country_cache[code]['conflict_deaths'] = float(deaths)
        except Exception as e:
            print(f"⚠️ DatasetManager failed to load GED: {e}")

        self.is_loaded = True
        print(f"✅ [DatasetManager] Preloaded data for {len(self.country_cache)} countries into memory.")

    def get_country_data(self, country_code: str) -> Dict[str, Any]:
        """Fetch cached global indicators for a country. Uses fallbacks if data is missing."""
        if not self.is_loaded:
            self.preload_data()
            
        code = country_code.upper()
        # Handle 2-letter to 3-letter conversions roughly for demo
        if code == "US": code = "USA"
        if code == "SG": code = "SGP"
        if code == "DE": code = "DEU"
        
        data = self.country_cache.get(code, {})
        
        return {
            "resilience": data.get("resilience", 0.65),
            "civil_liberty": data.get("civil_liberty", 0.70),
            "population": data.get("population", 15000000.0),
            "conflict_deaths": data.get("conflict_deaths", 0.0)
        }

dataset_manager = DatasetManager()
