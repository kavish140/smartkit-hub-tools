import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface VisitData {
  device: string;
  browser: string;
  country: string | null;
  city: string | null;
  ip: string | null;
  user_agent: string;
  is_bot: boolean;
}

export const useVisitTracking = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get device info
        const userAgent = navigator.userAgent;
        
        // Detect if it's a bot
        const botPatterns = [
          /bot/i, /crawler/i, /spider/i, /crawling/i, /slurp/i,
          /mediapartners/i, /apis-google/i, /headless/i, /phantom/i,
          /lighthouse/i, /gtmetrix/i, /pingdom/i, /uptime/i
        ];
        const isBot = botPatterns.some(pattern => pattern.test(userAgent));
        
        let device = 'Desktop';
        if (/mobile/i.test(userAgent)) {
          device = 'Mobile';
        } else if (/tablet/i.test(userAgent)) {
          device = 'Tablet';
        }

        // Get browser info
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        else if (userAgent.includes('Opera')) browser = 'Opera';

        // Get IP and location from free API with timeout
        let ip = null;
        let country = null;
        let city = null;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
          
          const response = await fetch('https://ipapi.co/json/', {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            ip = data.ip;
            country = data.country_name;
            city = data.city;
          }
        } catch (error) {
          // IP lookup failed or timed out - continue without it
        }

        // Insert visit data into Supabase
        const visitData: VisitData = {
          device,
          browser,
          country,
          city,
          ip,
          user_agent: userAgent,
          is_bot: isBot,
        };

        // Retry logic for Supabase insert
        let retries = 2;
        while (retries > 0) {
          const { error } = await supabase.from('visits').insert(visitData);
          
          if (!error) break;
          
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
      } catch (error) {
        // Tracking failed completely - continue silently
      }
    };

    trackVisit();
  }, []);
};
