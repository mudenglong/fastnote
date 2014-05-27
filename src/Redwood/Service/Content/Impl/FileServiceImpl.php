<?php
namespace Redwood\Service\Content\Impl;

use Redwood\Service\Common\BaseService;
use Redwood\Service\Content\FileService;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

use Imagine\Imagick\Imagine;
use Imagine\Image\Box;
use Imagine\Image\Point;
use Imagine\Image\ImageInterface;
use Redwood\Common\FileToolkit;

class FileServiceImpl extends BaseService implements FileService
{

    private function oprateAvatar($image, $imageTarget){
        $image->resize(new Box($imageTarget['width'], $imageTarget['height']));
        $image->save($imageTarget['filePath'], array('quality' => 90));

        $file = new File($imageTarget['filePath']);
        $newLargeImage = $this->generateUri($file);
        $finalPath = $this->getKernel()->getParameter('redwood.upload.public_directory') . '/' . str_replace('public://', '', $newLargeImage['directory']);

        $file->move($finalPath, $newLargeImage["filename"]);
    }

    public function buildUserAvatar($filePath, $options)
    {
        
        $imagine = new Imagine();
        $basicImage = $imagine->open($filePath)->copy();

        $basicImage->crop(new Point($options['x'], $options['y']), new Box($options['width'], $options['height']));

        $pathinfo = pathinfo($filePath);
        $largeImageTarget = array(
                'width' => 200,
                'height' => 200,
                'filePath' => "{$pathinfo['dirname']}/{$pathinfo['filename']}_large.{$pathinfo['extension']}",
        );

        $imageUri['large'] = $this->oprateAvatar($basicImage, $largeImageTarget);

        // $abc = new File($largeFilePath);
        // $newLargeImage = $this->generateUri($abc);
        // $finalPath = $this->getKernel()->getParameter('redwood.upload.public_directory') . '/' . str_replace('public://', '', $newLargeImage['directory']);

        // $abc->move($finalPath, $newLargeImage["filename"]);

        var_dump($filePath);


    }


	private function saveFile($file, $uri)
	{
		$parsed = $this->parseFileUri($uri);

		if ($parsed['access'] == 'public') {
			$directory = $this->getKernel()->getParameter('topxia.upload.public_directory');
		} else {
			$directory = $this->getKernel()->getParameter('topxia.upload.private_directory');
		}

		if (!is_writable($directory)) {
			throw $this->createServiceException("文件上传路径{$directory}不可写，文件上传失败。");
		}
		$directory .= '/' . $parsed['directory'];

		return $file->move($directory, $parsed['name']);
	}


    private function generateUri(File $file)
    {

        if ($file instanceof UploadedFile) {
            $filename = $file->getClientOriginalName();
        } else {
            $filename = $file->getFilename();
        }

        $filenameParts = explode('.', $filename);
        $ext = array_pop($filenameParts);
        if (empty($ext)) {
            throw $this->createServiceException('获取文件扩展名失败！');
        }

        $newImage["directory"] = 'public://user/'.date('Y') . '/' . date('m-d') . '/' . date('His');;
       
        $newImage["filename"] = substr(uniqid(), - 6) . substr(uniqid('', true), - 6) . '.' . $ext;
        
        return $newImage;
    }


}