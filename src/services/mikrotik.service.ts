import { RouterOSAPI } from "node-routeros";
import 'dotenv/config';

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
 
    console.log(`[MikroTik] Attempting to connect to ${host}:${port} as user '${user}'`);
 
    const conn = getMikrotikConnection();
    try {
      console.log(`[MikroTik] Connecting...`);
      await conn.connect();
      console.log(`[MikroTik] Connected successfully`);
 
      console.log(`[MikroTik] Fetching ARP table...`);
      const result = await conn.write("/ip/arp/getall");
      console.log(`[MikroTik] ARP table fetched, total entries: ${result.length}`);
      console.log(`[MikroTik] Sample data:`, result.slice(0, 2));
 
      return result as any[];
    } catch (error: any) {
      console.error(`[MikroTik] Connection failed: ${error.message}`);
      throw new Error(`Failed to connect to MikroTik: ${error.message}`);
    } finally {
      await conn.close();
      console.log(`[MikroTik] Connection closed`);
    }
  },
 
  isMacAddressActive: async (macAddress: string): Promise<boolean> => {
    console.log(`[MikroTik] Checking MAC address: ${macAddress}`);
    try {
      const arpTable = await mikrotikService.getArpTable();
      const normalizedMac = macAddress.toUpperCase();
      const found = arpTable.some(
        (device: any) => device["mac-address"]?.toUpperCase() === normalizedMac
      );
      console.log(`[MikroTik] MAC ${normalizedMac} found: ${found}`);
      return found;
    } catch (error: any) {
      throw new Error(`MikroTik validation failed: ${error.message}`);
    }
  },
};
 
export default mikrotikService;