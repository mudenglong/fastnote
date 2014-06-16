<?php
namespace Redwood\Service\Content;

use Symfony\Component\HttpFoundation\File\File;

interface FileService
{
	public function uploadAvatar($filePath, $options);

    public function sqlUriConvertAbsolutUri($sqlUri);

    public function uploadHtmlPic($filePath, array $options);

}