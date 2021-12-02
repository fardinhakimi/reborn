<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Carbon\Carbon;
use DateTime;
use Exception;
use PhpOffice\PhpSpreadsheet;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class Reading {

    private string $timezone;
    private float  $value;
    private string $metric;
    private int $meterId;
    private DateTime $dateTime;
    
    public function setMetric ( string $metric) {
        $this->metric = $metric;
    }

    public function setTimeZone ( string $timezone) {
        $this->timezone = $timezone;
    }

    public function setDateTime(DateTime $dateTime) {
        $this->dateTime = $dateTime;
    }

    public function setValue(float $value) {
        $this->value = $value;
    }

    public function setMeterId (int $meterId) {
        $this->meterId = $meterId;
    }

    public function getDateTime() {
        return $this->dateTime;
    }

}

class PiigabReadingParser {

    /** @var string */
    protected $timezone = 'Europe/Stockholm';
    private const KWH = 'kwh';

    /**
     * @param $row
     * @return null|Reading
     */
    public function getObject($row)
    {

        try {

            $row = trim(preg_replace('/\s\s+/', ' ', $row));



            $rowParts = explode(";", trim($row));
         
    
            if(empty($rowParts) || count($rowParts) < 7) {

                print_r("Row is malformed");
               
                return null;
            }

            echo trim(strtolower($rowParts[6]));

            if(trim(strtolower($rowParts[6])) !==  'energy' || strtolower($rowParts[5]) !== self::KWH) {
                print_r("Row is invalid");
                return null;
            }

            $ean = $rowParts[0];

            $value = $rowParts[4];

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setCellValue('A1', $value);

            echo "This is the value";
            var_dump($sheet->getCell('A1')->getValue());


            // 2021-08-26T06:01:21

            $date = str_replace("T", " ", $rowParts[3]);
   

            $date = Carbon::createFromFormat('Y-m-d H:i:s', $date, $this->timezone);

            $reading = new Reading();
            $reading->setDatetime($date);
            $reading->setValue($value);
            $reading->setMetric('energy');

            $reading->setMeterId(1);



            return $reading;

        } catch(Exception $ex) {
            print_r($ex->getMessage());
            return null;
        }

    }
}



$parser = new PiigabReadingParser();


$result = $parser->getObject("16810742;56052900LUG0102;Energy;2021-08-26T05:59:51;965325E-3;kWh; Energy ");

//print_r($result->getDateTime());

