import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { format } from 'date-fns';
import { BaseService } from '../services/BaseService';
import { logToDevServer } from '../logger';

export interface ExportFileOptions {
  filename: string;
  content: string;
  mimeType?: string;
}

export interface FileExportService {
  exportFile(options: ExportFileOptions): Promise<void>;
  generateExportFilename(type: 'vehicles' | 'sessions'): string;
}

export class EvsFileExportService extends BaseService implements FileExportService {
  async exportFile(options: ExportFileOptions): Promise<void> {
    // Temporarily disabled to prevent database file visibility in Files app
    throw new Error('Export functionality is temporarily disabled');
  }

  generateExportFilename(type: 'vehicles' | 'sessions'): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
    return `evstats-${type}-${timestamp}.csv`;
  }

  private async saveAndShareFile(filename: string, content: string, _mimeType: string): Promise<void> {
    try {
      // Ensure filename has .csv extension
      const csvFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
      
      // Save file to Cache directory for temporary sharing
      const result = await Filesystem.writeFile({
        path: csvFilename,
        data: content,
        directory: Directory.Cache,
        encoding: Encoding.UTF8
      });

      // Use Capacitor Share plugin with proper file sharing
      await Share.share({
        title: 'EVStats Export',
        text: `CSV export from EV Stats app`,
        files: [result.uri]
      });

    } catch (error) {
      // Handle share cancellation gracefully
      if (error.message && (error.message.includes('canceled') || error.message.includes('cancelled'))) {
        // User canceled the share - this is not an error condition
        return;
      }
      
      logToDevServer(`Error saving or sharing file: ${error.message || error}`, 'error');
      throw new Error(`Failed to export file: ${error.message}`);
    }
  }
}