<?php
namespace Redwood\Service\Content;

use Symfony\Component\HttpFoundation\File\File;

interface FileService
{
	public function buildUserAvatar($filePath, $options);

}