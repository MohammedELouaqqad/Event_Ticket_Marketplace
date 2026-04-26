package com.example.backendv.Service;


import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
@Slf4j
public class QrCodeGeneratorService {

    @Value("${qrcode.output.directory}")
    private String outputLocation;

    private static final String charset="UTF-8";

    private static final String strDateFormat="yyyyMMddhhmmss";


    public void generateQRCode(String message){
        System.out.println("### Generating QRCode ###");

        try{
            String finalMessage = (StringUtils.isNoneBlank(message))?message:"";
            processQRcode(finalMessage, prepareOutputFileName(), charset, 400, 400);
        }catch (WriterException e){
            e.printStackTrace();
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    private String prepareOutputFileName() {
        Date date = new Date();

        DateFormat dateFormat=new SimpleDateFormat(strDateFormat);

        String formattedDate = dateFormat.format(date);

        StringBuilder sb = new StringBuilder();

        sb.append(outputLocation).append("\\").append("QRCode").append(formattedDate).append(".png");

        return sb.toString();

    }


    private void processQRcode(String data, String path, String charset, int height, int width) throws WriterException, IOException {

        BitMatrix matrix = new MultiFormatWriter().encode(new String(data.getBytes(charset), charset), BarcodeFormat.QR_CODE,width,height);
        MatrixToImageWriter.writeToPath(matrix, path.substring(path.lastIndexOf('.')+1), new File(path));
    }


}
