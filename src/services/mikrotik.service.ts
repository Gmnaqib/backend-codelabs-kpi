import { RouterOSAPI } from "node-routeros";
import "dotenv/config";

const getMikrotikConnection = () => {
  return new RouterOSAPI({
    host: process.env.MIKROTIK_HOST!,
    user: process.env.MIKROTIK_USER!,
    password: process.env.MIKROTIK_PASS!,
    port: Number(process.env.MIKROTIK_PORT) || 8728,
    timeout: 10,
  });
};

const mikrotikService = {
  getArpTable: async (): Promise<any[]> => {
    const host = process.env.MIKROTIK_HOST;
    const port = process.env.MIKROTIK_PORT || 8728;
    const user = process.env.MIKROTIK_USER;

    

    const conn = getMikrotikConnection();
    try {
      await conn.connect();
      

      const result = await conn.write("/ip/arp/getall");
      
      return result as any[];
    } catch (error: any) {
      console.error(`[MikroTik] Connection failed: ${error.message}`);
      throw new Error(`Failed to connect to MikroTik: ${error.message}`);
    } finally {
      await conn.close();
      
    }
  },

  getDhcpLeases: async (): Promise<any[]> => {
    const conn = getMikrotikConnection();
    try {
      
      await conn.connect();
      

      const result = await conn.write("/ip/dhcp-server/lease/getall");
      

      return result as any[];
    } catch (error: any) {
      console.error(`[MikroTik] DHCP lease fetch failed: ${error.message}`);
      throw new Error(`Failed to fetch DHCP leases from MikroTik: ${error.message}`);
    } finally {
      await conn.close();
      
    }
  },

  getMacAddressByIp: async (ip: string): Promise<string | null> => {
    // Normalize: strip ::ffff: prefix from IPv4-mapped IPv6
    const normalizedIp = ip.replace(/^::ffff:/, "").trim();
    

    try {
      const leases = await mikrotikService.getDhcpLeases();

      const entry = leases.find((item: any) => {
        const activeAddr = item["active-address"]?.trim();
        const addr = item.address?.trim();
        return activeAddr === normalizedIp || addr === normalizedIp;
      });

      if (!entry) {
        
        return null;
      }

      // Prefer active-mac-address, fall back to mac-address
      const rawMac: string | undefined = entry["active-mac-address"] || entry["mac-address"];
      if (!rawMac) {
        
        return null;
      }

      // Normalize MAC to uppercase colon format (AA:BB:CC:DD:EE:FF)
      const mac = rawMac.toUpperCase().replace(/-/g, ":");
      
      return mac;
    } catch (error: any) {
      console.error(`[MikroTik] getMacAddressByIp failed: ${error.message}`);
      throw new Error(`MikroTik DHCP lookup failed: ${error.message}`);
    }
  },

  isMacAddressActive: async (macAddress: string): Promise<boolean> => {
    
    try {
      const arpTable = await mikrotikService.getArpTable();
      const normalizedMac = macAddress.toUpperCase();
      const found = arpTable.some((device: any) => device["mac-address"]?.toUpperCase() === normalizedMac);
      
      return found;
    } catch (error: any) {
      throw new Error(`MikroTik validation failed: ${error.message}`);
    }
  },
};

export default mikrotikService;
