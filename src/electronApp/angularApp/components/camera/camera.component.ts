import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrinterService } from '../../services/printerService';
/**
 * Component for viewing the printer camera feed.
 */
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  /**
   * Gets the address of teh camera stream.
   */
  public StreamAddress: string;

  /**
   * Gets a value indicating that teh camera is available.
   */
  public CameraAvailable: boolean = true;

  /**
   * The check interval timeout for testing the camera connection.
   */
  private checkInterval: NodeJS.Timeout;

  @ViewChild('ImageElement') private imageElement: ElementRef;

  /**
   * Initializes a new instance of the CameraComponent class.
   * @param printerService The printer service.
   */
  constructor(private printerService: PrinterService) {
    this.StreamAddress = printerService.GetCameraVideoStreamAddress();
  }

  /**
  * Invoked when the Angular component is initialized.
  */
  ngOnInit(): void {
    // Depending on the printer settings, the camera may become unavailable when printing finished, 
    // so set a timer to check for this and show a message if the camera is unavailable
    this.checkInterval = setInterval(async () => {
      this.CameraAvailable = await this.printerService.GetIsCameraEnabled();
    }, 5000);
  }

  /**
  * Invoked when the Angular component is destroyed.
  */
  ngOnDestroy(): void  {

    // A bug in Chromium means that the img element will hold the connection to the
    // mjpg stream forever, so call stop on the window to shut down all connections.
    window.stop();


    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}
