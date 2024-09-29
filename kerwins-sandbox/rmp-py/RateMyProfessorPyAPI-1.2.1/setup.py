import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="RateMyProfessorPyAPI",
    version="1.2.1",
    author="Alex Lu",
    author_email="yiyangl6@asu.edu",
    description="Fixed some weird bugs that could be triggered rarely.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/remiliacn/RateMyProfessorPy",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)